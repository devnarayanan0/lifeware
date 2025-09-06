import { supabase, isSupabaseConfigured, safeSupabaseOperation } from './supabase';

// Chatbot API configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

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
      if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI health assistant specializing in Thalassemia support. Provide accurate, helpful information about diet, treatment, symptoms, and support resources. Always recommend consulting healthcare professionals for personalized medical advice. Keep responses concise and helpful.'
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I couldn\'t process your request.';
    } catch (error) {
      console.error('Error calling Groq chatbot API:', error);
      
      if (error.message.includes('API key not configured')) {
        return 'AI assistance is not properly configured. Please check the API key settings.';
      }
      
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