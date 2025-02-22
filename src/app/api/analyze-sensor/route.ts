import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { data, system_prompt } = await req.json();

    // Calculate basic statistics
    const min = Math.min(...data);
    const max = Math.max(...data);
    const avg = data.reduce((a: number, b: number) => a + b, 0) / data.length;

    const prompt = `${system_prompt}
    Data sensor (${data.length} points):
    ${JSON.stringify(data)}
    
    Format respons dengan:
    - Gunakan Bahasa Indonesia
    - Paragraf pendek maksimal 3 kalimat
    - Highlight angka penting dengan **bold**
    - Gunakan format waktu 24 jam`;

    const claudeResponse = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 1000,
          system: `Anda adalah ahli analisis sensor struktur. Berikan analisis dalam Bahasa Indonesia yang mudah dipahami teknisi lapangan. 
        Gunakan satuan Gal (1 Gal = 1 cm/s²). Data statistik: Min=${min.toFixed(2)}, Max=${max.toFixed(2)}, Rata2=${avg.toFixed(2)}`,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      }
    );

    if (!claudeResponse.ok) {
      const error = await claudeResponse.json();
      throw new Error(error.error?.message || 'Failed to analyze data');
    }

    const result = await claudeResponse.json();
    return new Response(result.content[0].text, {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
