// Initialize Supabase client
const supabaseUrl = "https://ixnbvfvvxnxnwxnwvnwv.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bmJ2ZnZ2eG54bnd4bnd2bnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYzOTk0MjYsImV4cCI6MjAzMTk3NTQyNn0.Nh8HjzI7kTYzQnBwCuB-dnHCTxmAGg5WD3wT9dNyYAA"

// Create a single supabase client for interacting with your database
const supabase = {
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        single: async () => {
          try {
            const response = await fetch(
              `${supabaseUrl}/rest/v1/${table}?select=${columns || "*"}&${column}=eq.${value}`,
              {
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                },
              },
            )
            if (!response.ok) throw new Error("Network response was not ok")
            const data = await response.json()
            return { data: data[0] || null, error: null }
          } catch (error) {
            console.error("Error fetching data:", error)
            return { data: null, error }
          }
        },
        order: (orderColumn, { ascending } = {}) => ({
          limit: async (limit) => {
            try {
              const order = ascending ? "asc" : "desc"
              const response = await fetch(
                `${supabaseUrl}/rest/v1/${table}?select=${columns || "*"}&${column}=eq.${value}&order=${orderColumn}.${order}&limit=${limit}`,
                {
                  headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                  },
                },
              )
              if (!response.ok) throw new Error("Network response was not ok")
              const data = await response.json()
              return { data, error: null }
            } catch (error) {
              console.error("Error fetching data:", error)
              return { data: [], error }
            }
          },
        }),
      }),
      ilike: (column, value) => ({
        order: async (orderColumn, { ascending } = {}) => {
          try {
            const order = ascending ? "asc" : "desc"
            const response = await fetch(
              `${supabaseUrl}/rest/v1/${table}?select=${columns || "*"}&${column}=ilike.${value}&order=${orderColumn}.${order}`,
              {
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                },
              },
            )
            if (!response.ok) throw new Error("Network response was not ok")
            const data = await response.json()
            return { data, error: null }
          } catch (error) {
            console.error("Error fetching data:", error)
            return { data: [], error }
          }
        },
      }),
      order: (orderColumn, { ascending } = {}) => ({
        async then(resolve, reject) {
          try {
            const order = ascending ? "asc" : "desc"
            const response = await fetch(
              `${supabaseUrl}/rest/v1/${table}?select=${columns || "*"}&order=${orderColumn}.${order}`,
              {
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                },
              },
            )
            if (!response.ok) throw new Error("Network response was not ok")
            const data = await response.json()
            resolve({ data, error: null })
          } catch (error) {
            console.error("Error fetching data:", error)
            reject({ data: [], error })
          }
        },
      }),
    }),
    insert: async (rows) => {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(rows),
        })
        if (!response.ok) throw new Error("Network response was not ok")
        const data = await response.json()
        return { data, error: null }
      } catch (error) {
        console.error("Error inserting data:", error)
        return { data: null, error }
      }
    },
    update: (updates) => ({
      eq: async (column, value) => {
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`, {
            method: "PATCH",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
              Prefer: "return=representation",
            },
            body: JSON.stringify(updates),
          })
          if (!response.ok) throw new Error("Network response was not ok")
          const data = await response.json()
          return { data, error: null }
        } catch (error) {
          console.error("Error updating data:", error)
          return { data: null, error }
        }
      },
    }),
    delete: () => ({
      eq: async (column, value) => {
        try {
          const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`, {
            method: "DELETE",
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          })
          if (!response.ok) throw new Error("Network response was not ok")
          return { error: null }
        } catch (error) {
          console.error("Error deleting data:", error)
          return { error }
        }
      },
    }),
  }),
  auth: {
    getUser: async () => {
      // This is a simplified mock implementation
      // In a real app, you would check for a stored token and validate it
      return { data: { user: null }, error: null }
    },
  },
}

export { supabase }
