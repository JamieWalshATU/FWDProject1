# PdfParserComponent

**Source**: `src/app/core/features/pdf-parser/pdf-parser.component.ts`

## Overview

`PdfParserComponent` lets you upload a PDF, send it to Mistral for OCR + MCQ generation, parse the response, and save the resulting questions to a course.

## Inputs

- `@Input() id: string = ''` – ID of the course to attach questions to.
- `@Input() color: string = ''` – CSS color for buttons and card header.

## Initialization

```ts
ngOnInit() {
  if (!this.apiKey) {
    alert('Please set your Mistral API key in the environment file.');
  }
  if (this.color) {
    document.documentElement.style.setProperty('--course-color', this.color);
  }
  addIcons({ documentOutline });
}
```

- Checks for API key, sets CSS variable, registers the icon.

## File Selection

```ts
openFileSelector() {
  document.getElementById('pdf-upload')?.click();
}

onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.invalid = true;
    this.parsePdf(file);
  }
}
```

- `openFileSelector()` triggers the hidden file input.
- `onFileChange` grabs the selected PDF and begins parsing.

## PDF Upload & OCR

```ts
async parsePdf(file: File) {
  this.loading = true;
  try {
    const response = await this.client.files.upload({
      file: { fileName: file.name, content: await file.arrayBuffer() },
      purpose: 'ocr',
    });
    this.uploadedPdf = response;
    this.invalid = false;
  } catch (error) {
    alert('File upload failed. Check API key and file format.');
    this.invalid = true;
  } finally {
    this.loading = false;
  }
}
```

- Converts the PDF to `ArrayBuffer` and uploads it for OCR.

## Generating Questions

```ts
async getChatResponse(): Promise<void> {
  if (!this.uploadedPdf) return;
  this.loading = true;
  try {
    const { url } = await this.client.files.getSignedUrl({ fileId: this.uploadedPdf.id });
    const chatResponse = await this.client.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        { role: 'user', content: [
            { type: 'text', text:
              'Can you generate 10 MCQ based questions on this document?\nQ: [question]\nA: [answer]\nW1: [wrong1]\nW2: [wrong2]\nW3: [wrong3]' },
            { type: 'document_url', documentUrl: url }
          ]
        }
      ],
    });
    const content = chatResponse.choices?.[0]?.message.content as string;
    this.questions = this.parseQuestions(content);
    this.addQuestionsToCourse(this.questions);
  } catch (error) {
    console.error('Error getting chat response:', error);
  } finally {
    this.loading = false;
  }
}
```

- Requests MCQs from Mistral, parses the raw text.

## Parsing the Response

```ts
parseQuestions(responseContent: string): McqQuestion[] {
  const questions: McqQuestion[] = [];
  const lines = responseContent.split('\n');
  let currentQuestion: McqQuestion | null = null;

  lines.forEach(line => {
    if (line.startsWith('Q:')) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = { question: line.substring(2).trim(), correctAnswer: '', wrongAnswers: [] };
    } else if (line.startsWith('A:') && currentQuestion) {
      currentQuestion.correctAnswer = line.substring(2).trim();
    } else if (/^W[123]:/.test(line) && currentQuestion) {
      const wrong = line.substring(line.indexOf(':') + 1).trim();
      currentQuestion.wrongAnswers.push(wrong);
    }
  });

  if (currentQuestion) questions.push(currentQuestion);
  return questions;
}
```

- Splits on newline, identifies `Q:`, `A:`, `W1:`,`W2:`,`W3:` and builds `McqQuestion` objects.

## Saving to Course

```ts
async addQuestionsToCourse(questions: McqQuestion[]): Promise<void> {
  if (questions.length === 0) return console.error('No questions to add.');
  const course = await this.courseData.getCourseById(this.id);
  if (!course) return console.error('Course not found.');
  const setName = `Question Set ${course.questionSets.length + 1}`;
  course.addQuestionSet(setName, questions);
  await this.courseData.updateCourse(course);
  this.questions = [];
}
```

- Retrieves the course by `id`, creates a new set, persists via `CourseDataService`.

## Sample API Response

```ts
["Here are 10 multiple-choice questions based on the provided document:", "", "Q: Who is the author of PrefixPacker?", "A: Jamie Walsh", "W1: John Doe", "W2: Alice Smith", "W3: Bob Johnson"];
```

## parseQuestions Function: Line-by-Line Breakdown

```ts
parseQuestions(responseContent: string): McqQuestion[] {
  const questions: McqQuestion[] = [];          // 1. Initialize empty array for parsed questions
  const lines = responseContent.split('\n');   // 2. Split response text into lines
  let currentQuestion: McqQuestion | null = null; // 3. Placeholder for building each question

  lines.forEach(line => {                       // 4. Iterate over each line
    if (line.startsWith('Q:')) {               // 5. Detect question line
      if (currentQuestion) questions.push(currentQuestion); // 6. Push previous question if exists
      currentQuestion = {                       // 7. Start a new question object
        question: line.substring(2).trim(),    // 8. Extract question text after 'Q:'
        correctAnswer: '',                      // 9. Initialize correctAnswer
        wrongAnswers: []                        // 10. Initialize wrongAnswers array
      };
    } else if (line.startsWith('A:') && currentQuestion) { // 11. Detect answer line
      currentQuestion.correctAnswer = line.substring(2).trim(); // 12. Extract correct answer
    } else if (/^W[123]:/.test(line) && currentQuestion) {     // 13. Detect wrong answer lines (W1/W2/W3)
      const wrong = line.substring(line.indexOf(':') + 1).trim(); // 14. Extract wrong answer text
      currentQuestion.wrongAnswers.push(wrong); // 15. Add to wrongAnswers
    }
  });

  if (currentQuestion) questions.push(currentQuestion); // 16. Push the last question
  return questions;                                     // 17. Return array of McqQuestion
}
```

---

_End of PdfParserComponent breakdown._
