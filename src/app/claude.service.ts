import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaudeService {
  private apiKey = environment.anthropicApiKey;
  private apiUrl = 'https://api.anthropic.com/v1/messages';
  private documentContext: string = '';
  private conversationHistory: {role: 'user' | 'assistant', content: string}[] = [];

  setDocumentContext(text: string): void {
    this.documentContext = text;
    this.conversationHistory = [];
  }

  async sendMessageStream(message: string, onChunk: (chunk: string) => void): Promise<void> {
    const systemPrompt = this.documentContext
      ? `Tu es un assistant qui répond aux questions basées sur ce document :\n\n${this.documentContext}`
      : 'Tu es un assistant utile et bienveillant.';

    this.conversationHistory.push({ role: 'user', content: message });

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        stream: true,
        messages: this.conversationHistory
      })
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            fullResponse += parsed.delta.text;
            onChunk(parsed.delta.text);
          }
        } catch {}
      }
    }

    this.conversationHistory.push({ role: 'assistant', content: fullResponse });
  }
}