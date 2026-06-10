import { Injectable } from '@angular/core';
import Anthropic from '@anthropic-ai/sdk';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClaudeService {
  private client: Anthropic;
  private documentContext: string = '';
  private conversationHistory: {role: 'user' | 'assistant', content: string}[] = [];

  constructor() {
    this.client = new Anthropic({
      apiKey: environment.anthropicApiKey,
      dangerouslyAllowBrowser: true
    });
  }

  setDocumentContext(text: string): void {
    this.documentContext = text;
    this.conversationHistory = [];
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  async sendMessageStream(message: string, onChunk: (chunk: string) => void): Promise<void> {
    const systemPrompt = this.documentContext 
      ? `Tu es un assistant qui répond aux questions basées sur ce document :\n\n${this.documentContext}`
      : 'Tu es un assistant utile et bienveillant.';

    this.conversationHistory.push({ role: 'user', content: message });

    let fullResponse = '';

    const stream = await this.client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages: this.conversationHistory
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        fullResponse += chunk.delta.text;
        onChunk(chunk.delta.text);
      }
    }

    this.conversationHistory.push({ role: 'assistant', content: fullResponse });
  }
}