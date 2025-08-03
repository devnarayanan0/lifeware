import { supabase, isSupabaseConfigured, safeSupabaseOperation } from './supabase';

// Chatbot API configuration
const CHATBOT_API_KEY = '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';

// Supabase API functions
export const supabaseApi = {
  // Get donor count
  async getDonorCount() {
    try {
      const { data, error } = await safeSupabaseOperation(async () => {
        return await supabase
          .from('donors')
          .select('name');
      });
      
      if (error) {
        console.error('Error fetching donor count:', error);
        return 0;
      }
      
      return data?.length || 0; // total donors
    } catch (error) {
      console.error('Error fetching donor count:', error);
      return 0;
    }
  },

  // Register new donor
  async registerDonor(donorData) {
    try {
      const { data, error } = await safeSupabaseOperation(async () => {
        return await supabase
          .from('donors')
          .insert([donorData])
          .select();
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data?.[0];
    } catch (error) {
      console.error('Error registering donor:', error);
      throw error;
    }
  },

  // Get all donors
  async getDonors() {
    try {
      const { data, error } = await safeSupabaseOperation(async () => {
        return await supabase
          .from('donors')
          .select('*')
          .order('name', { ascending: true });
      });
      
      if (error) {
        console.error('Error fetching donors:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching donors:', error);
      return [];
    }
  },

  // Search donors
  async searchDonors(searchParams) {
    try {
      const { data, error } = await safeSupabaseOperation(async () => {
        let query = supabase
          .from('donors')
          .select('*');
        
        // Add filters based on search parameters
        if (searchParams.bloodGroup) {
          query = query.eq('blood_group', searchParams.bloodGroup);
        }
        
        if (searchParams.location) {
          query = query.ilike('location', `%${searchParams.location}%`);
        }
        
        if (searchParams.searchQuery) {
          query = query.or(`name.ilike.%${searchParams.searchQuery}%,location.ilike.%${searchParams.searchQuery}%`);
        }
        
        return await query.order('name', { ascending: true });
      });
      
      if (error) {
        console.error('Error searching donors:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error searching donors:', error);
      return [];
    }
  },
};

// Chatbot API functions
export const chatbotApi = {
  async sendMessage(message) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CHATBOT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI health assistant specializing in Thalassemia support. Provide accurate, helpful information about diet, treatment, symptoms, and support resources. Always recommend consulting healthcare professionals for personalized medical advice.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I couldn\'t process your request.';
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      return 'I\'m having trouble connecting right now. Please try again later.';
    }
  },
};

// Export a simple API object for backward compatibility
const api = {
  supabaseApi,
  chatbotApi,
  isSupabaseConfigured
};

export default api;