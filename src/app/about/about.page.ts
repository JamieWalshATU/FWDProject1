import { ErrorLoggerService } from '../core/services/error-logger.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonList,
  IonListHeader,
  IonItem,
  IonAccordionGroup, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonButton, 
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    CommonModule,
    FormsModule,
  ],
})
export class AboutPage implements OnInit, AfterViewInit {
  @ViewChild(IonContent) content!: IonContent;

  // Define the sections for the observer
  sections = [
    { id: 'intro', title: 'Introduction' },
    { id: 'faq', title: 'FAQ' },
    { id: 'apiSetup', title: 'API Setup' },
    { id: 'usage', title: 'Usage Guide' },
    { id: 'troubleshooting', title: 'Troubleshooting' },
  ];

  activeSection = 'intro';
  constructor(private errorLoggerService: ErrorLoggerService) {}
  ngOnInit() {}

  ngAfterViewInit() {
    this.observeSections();
  }
  // Finds section in the DOM and scrolls to it
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  // Tracks which section is currently in view, and sets the active section. This is used to highlight the active section in the menu.
  observeSections() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      },
      // Threshold: 0.3 means that 30% of the section must be in view to be considered "in view"
      { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' },
    );

    // Loops through each section and tells the observer to observe it,
    this.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
  }

  downloadLogs() {
    this.errorLoggerService.downloadLogs();
  }

  clearLogs() {
    this.errorLoggerService.clearLogs();
  }
}
