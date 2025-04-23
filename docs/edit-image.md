# EditImageComponent

**Source**: `src/app/core/features/edit-image/edit-image.component.ts`

## Overview

`EditImageComponent` allows instructors to view and change a course's image. It loads the existing image, opens a modal for file selection, uploads to image storage, and returns the new image URL.

## Inputs

- `@Input() courseId: string = ''` – ID of the course whose image will be edited.

## Initialization

```ts
ngOnInit() {
  if (this.courseId) {
    this.courseData.getCourseById(this.courseId).then(course => {
      this.course = course;
      if (course?.imageUrl) {
        this.imageUrl = course.imageUrl;
      }
    });
  }
}
```

- Fetches course by `courseId` and stores current `imageUrl`.

## File Selection & Upload

```ts
async onFileSelected(event: Event): Promise<void> {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files?.length) {
    const file = fileInput.files[0];
    try {
      this.newImageUrl = await this.imageStorageService.uploadImage(file);
      this.imageUrl = this.newImageUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }
}
```

- Reads selected file, uploads via `ImageStorageService`, updates `imageUrl`.

## Modal Actions

```ts
cancel() {
  this.modalCtrl.dismiss(null, 'cancel');
}

confirm() {
  this.modalCtrl.dismiss(this.newImageUrl, 'confirm');
}
```

- `cancel()` closes modal without changes.
- `confirm()` returns the new image URL.

## Template Highlights

- Uses `<ion-modal>` to wrap the form.
- `<input type="file" (change)="onFileSelected($event)">` inside modal content.
- `<ion-button>` bound to `cancel()` and `confirm()`.
- Displays current or newly selected image preview.

---

_End of EditImageComponent breakdown._
