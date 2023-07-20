import { Component } from '@angular/core';
import {
  NgDocPortalComponentsModule,
  DocPageConfig,
} from '@oasisdigital/ng-doc-portal';

@Component({
  standalone: true,
  imports: [NgDocPortalComponentsModule],
  template: `
    <textarea ngdpCodeSnippet lang="typescript">
      class ExampleComponent {
        @ViewChild('modalContent') modalContent?: TemplateRef<any>;
        modalRef?: DialogRef<any>;

        constructor(private modal: Modal) {}

        openModal() {
          this.modalRef = this.modal.open(this.modalContent, {
            height: '250px',
            width: '300px',
          });
        }

        closeModal() {
          this.modalRef?.close();
        }
      }
    </textarea
    >
  `,
})
export class CodeSnippetExampleComponent {}

const docPageConfig: DocPageConfig = {
  title: 'General/Code Snippet Example',
  component: CodeSnippetExampleComponent,
};

export default docPageConfig;
