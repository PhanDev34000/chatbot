import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClaudeService } from './claude.service';
import { DocumentService } from './document.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col h-[90vh]">
        
        <!-- Header -->
        <div class="bg-blue-600 text-white p-4 rounded-t-2xl">
          <h1 class="text-xl font-bold">💬 Chatbot Claude</h1>
          <p class="text-sm text-blue-200">Posez vos questions ou uploadez un document</p>
        </div>

        <!-- Upload -->
        <div class="p-4 border-b flex items-center gap-3">
          <label class="cursor-pointer bg-blue-50 border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            📄 Choisir un PDF
            <input type="file" accept=".pdf" class="hidden" (change)="onFileUpload($event)"/>
          </label>
          <span *ngIf="documentLoaded" class="text-green-600 font-medium">✅ Document chargé</span>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          <div *ngFor="let msg of messages" 
               [class]="msg.role === 'Vous' ? 'flex justify-end' : 'flex justify-start'">
            <div [class]="msg.role === 'Vous' 
              ? 'bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]'
              : 'bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-sm max-w-[80%]'">
              <p class="text-sm font-semibold mb-1">{{ msg.role }}</p>
              <p class="text-sm whitespace-pre-wrap">{{ msg.content }}</p>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="p-4 border-t flex gap-2">
          <input 
            [(ngModel)]="userInput" 
            (keyup.enter)="sendMessage()"
            placeholder="Votre message..." 
            class="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button 
            (click)="sendMessage()"
            class="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-medium">
            Envoyer
          </button>
        </div>

      </div>
    </div>
  `
})
export class AppComponent {
  userInput = '';
  messages: {role: string, content: string}[] = [];
  documentLoaded = false;

  constructor(
    private claude: ClaudeService,
    private documentService: DocumentService,
    private cdr: ChangeDetectorRef
  ) {}

  async onFileUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const text = await this.documentService.extractTextFromPdf(file);
    this.claude.setDocumentContext(text);
    this.documentLoaded = true;
    this.cdr.detectChanges();
  }

  async sendMessage() {
    if (!this.userInput.trim()) return;
    this.messages.push({ role: 'Vous', content: this.userInput });
    this.messages.push({ role: 'Claude', content: '' });
    const claudeIndex = this.messages.length - 1;
    const question = this.userInput;
    this.userInput = '';

    await this.claude.sendMessageStream(question, (chunk: string) => {
      this.messages[claudeIndex].content += chunk;
      this.cdr.detectChanges();
    });
  }
}