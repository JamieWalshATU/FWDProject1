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
  IonAccordionGroup,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [
    IonAccordionGroup,
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

  sections = [
    { id: 'intro', title: 'Introduction' },
    { id: 'faq', title: 'FAQ' },
    { id: 'apiSetup', title: 'API Setup' },
    { id: 'usage', title: 'Usage Guide' },
    { id: 'troubleshooting', title: 'Troubleshooting' },
    { id: 'about', title: 'About' },
  ];

  activeSection = 'intro';

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.observeSections();
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  observeSections() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' },
    );

    this.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
  }
}
