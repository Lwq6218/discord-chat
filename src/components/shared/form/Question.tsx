import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/providers/theme-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

interface Props {
  userId?: string;
  type: 'Edit' | 'Add';
  question?: {
    id: string;
    title: string;
    content: string;
    tags: { name: string }[];
  };
}
const QuestionSchema = z.object({
  title: z.string().min(5).max(130),
  content: z.string().min(5),
  tagsName: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export default function Question({ type, question }: Props) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const groupedTags = question?.tags.map((tag) => tag.name);
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: question?.title || '',
      content: question?.content || '',
      tagsName: groupedTags || [],
    },
  });
  const [isSubmitting, setSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const createQuestion = useMutation({
    mutationFn: (values: z.infer<typeof QuestionSchema>) =>
      axios.post('/question', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
  const updateQuestion = useMutation({
    mutationFn: (values: any) => axios.patch(`/question`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['question', question?.id],
      });
    },
  });
  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    setSubmitting(true);

    try {
      if (type === 'Edit') {
        updateQuestion.mutate({
          id: question?.id,
          title: values.title,
          content: values.content,
        });
        navigate(`/devflow/question/${question?.id}`);
      }

      if (type === 'Add') {
        createQuestion.mutate({
          title: values.title,
          content: values.content,
          tagsName: values.tagsName,
        });
        navigate('/devflow/questions');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  }
  const editorRef = useRef(null);

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === 'Enter' && field.name === 'tagsName') {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();
      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return form.setError('tagsName', {
            type: 'required',
            message: 'Tag must be less than 15 characters',
          });
        }
      }
      if (!field.value.includes(tagValue as never)) {
        form.setValue('tagsName', [...field.value, tagValue]);
        tagInput.value = '';
        form.clearErrors('tagsName');
      } else {
        form.trigger();
      }
    }
  };
  const handleTagRemove = (tag: string, filed: any) => {
    const newTags = filed.value.filter((t: string) => t !== tag);
    form.setValue('tagsName', newTags);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {t('Question Title')}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                {t(
                  "Be specific and imagine you're asking a question to another person"
                )}
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {t('Detailed explanation of your problem')}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={import.meta.env.VITE_TINY_API_KEY}
                  onInit={(_evt: any, editor: any) => {
                    editorRef.current = editor;
                  }}
                  onBlur={field.onBlur}
                  onEditorChange={(content: any) => field.onChange(content)}
                  initialValue={question?.content || ''}
                  init={{
                    height: 350,
                    menubar: false,
                    language: 'zh_CN',
                    plugins: [
                      'advlist',
                      'autolink',
                      'lists',
                      'link',
                      'image',
                      'charmap',
                      'preview',
                      'anchor',
                      'searchreplace',
                      'visualblocks',
                      'codesample',
                      'fullscreen',
                      'insertdatetime',
                      'media',
                      'table',
                    ],
                    toolbar:
                      'undo redo | ' +
                      'codesample | bold italic forecolor | alignleft aligncenter |' +
                      'alignright alignjustify | bullist numlist',
                    content_style: 'body { font-family:Inter; font-size:16px }',
                    skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                    content_css: theme === 'dark' ? 'dark' : 'light',
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                {t(
                  'Introduce the problem and expand on what you put in the title. Minimum 5 characters.'
                )}
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagsName"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {t('Tags')}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    disabled={type === 'Edit'}
                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                    onKeyDown={(e) => {
                      handleInputKeyDown(e, field);
                    }}
                  />
                  <div className="flex-start mt-2.5 gap-2.5">
                    {field.value.map((tag) => (
                      <Badge
                        key={tag}
                        className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none p-4 capitalize"
                        onClick={
                          type !== 'Edit'
                            ? () => handleTagRemove(tag, field)
                            : () => {}
                        }
                      >
                        {tag}
                        {type !== 'Edit' && (
                          <img
                            src="/assets/icons/close.svg"
                            className="cursor-pointer"
                            width={12}
                            height={12}
                            alt="Close icon"
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                {t(
                  'Add up to 3 tags to describe what your question is about. You need to press enter to add a tag.'
                )}
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit !text-light-900"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>{type === 'Edit' ? t('Editing...') : t('Posting...')}</>
            ) : (
              <>{type === 'Edit' ? t('Edit Question') : t('Ask a Question')}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
