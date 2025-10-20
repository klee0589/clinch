import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      // Create user in database
      const { data: user, error } = await supabase
        .from('User')
        .insert({
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          clerkId: id,
          email: email_addresses[0]?.email_address || '',
          firstName: first_name || null,
          lastName: last_name || null,
          role: 'TRAINEE', // Default role, will be updated in onboarding
          imageUrl: image_url || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return new Response('Error: Failed to create user', {
          status: 500,
        });
      }

      console.log('User created successfully:', user);
    } catch (error) {
      console.error('Error in user.created webhook:', error);
      return new Response('Error: Internal server error', {
        status: 500,
      });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      // Update user in database
      const { error } = await supabase
        .from('User')
        .update({
          email: email_addresses[0]?.email_address || '',
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
          updatedAt: new Date().toISOString(),
        })
        .eq('clerkId', id);

      if (error) {
        console.error('Error updating user:', error);
        return new Response('Error: Failed to update user', {
          status: 500,
        });
      }

      console.log('User updated successfully');
    } catch (error) {
      console.error('Error in user.updated webhook:', error);
      return new Response('Error: Internal server error', {
        status: 500,
      });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      // Delete user from database
      const { error } = await supabase
        .from('User')
        .delete()
        .eq('clerkId', id);

      if (error) {
        console.error('Error deleting user:', error);
        return new Response('Error: Failed to delete user', {
          status: 500,
        });
      }

      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error in user.deleted webhook:', error);
      return new Response('Error: Internal server error', {
        status: 500,
      });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
