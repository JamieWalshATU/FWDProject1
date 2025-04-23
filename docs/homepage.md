# PDF Based MCQ Generator

A dynamic MCQ Generator based on PDF files parsed by Mistral AI, using Ionic & Angular

# FWDProject1 Component Documentation

Welcome to the FWDProject1 GitHub Wiki. This site provides detailed breakdowns of each core component in the application.

## Components

- [PdfParserComponent](pdfParser.md)
- [CourseCreatePage](course-create.md)
- [CourseDetailsPage](course-details.md)
- [DashboardComponent](dashboard.md)
- [EditImageComponent](edit-image.md)
- [MCQTestPage](mcqtest.md)

## Acknowledgements

- Much of the project is based on Mistral OCR [MISTRAL OCR](https://mistral.ai/news/mistral-ocr)

## 🌍 Environment Variables

To run this project, you need to set up the following environment variables.

## 📌 Step 1: Generate Environment Files

Run the following command in the terminal to generate the environment files:

```sh
ng g environments
```

## 📌 Step 2: Configure Environment Files

In both `environments.development.ts` and `environment.ts`, add the following code:

```ts
export const environment = {
  deployment: false,
  MISTRAL_API_KEY: "YOUR-API-KEY",
};
```

## 📌 Step 3: Get Your Mistral API Key

You need to register and obtain an API Key from Mistral AI at the following link:

🔗 Mistral API Console
