'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export default function Home() {
  const [value, setValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted value:', value);
  
    // Convert URL to a numeric hash
    const numValue = await getNumericHash(value);
    
    // Convert the number to Base62
    const shortUrl = toBase62(numValue);
  
    console.log({ shortUrl });
    setValue(shortUrl);
  };
  
  // Convert a string (URL) to a numeric hash
  async function getNumericHash(str: string): Promise<number> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
  
    // Convert first 6 bytes into a number (adjustable)
    const num = hashArray.slice(0, 6).reduce((acc, byte) => (acc << 8) + byte, 0);
    return num;
  }
  
  // Convert number to Base62
  function toBase62(deci: number): string {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let hashStr = "";
  
    while (deci > 0) {
      const remainder = deci % 62;
      hashStr = chars[remainder] + hashStr;
      deci = Math.floor(deci / 62);
    }
  
    return hashStr || "0"; // Return "0" if input is 0
  }
  
  

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-8 text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
          <p className="text-muted-foreground">Enter your message below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Type something..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="pr-12"
            />
            <Button 
              type="submit" 
              size="icon"
              className="absolute right-1 top-1 h-[calc(100%-8px)]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <p>{value}</p>
      </div>
    </main>
  );
}