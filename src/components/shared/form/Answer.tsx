import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useTheme } from '@/providers/theme-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import qs from 'query-string';
import { ElementRef, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
  questionId: string;
}
export const AnswerSchema = z.object({
  content: z.string().min(30),
});

export default function Answer({ questionId }: Props) {
  const editorRef = useRef(null);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: '',
    },
  });

  const createAnswerMutation = useMutation({
    mutationFn: (values: any) => axios.post('/answer', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', questionId] });
      queryClient.invalidateQueries({ queryKey: ['question', questionId] });
    },
  });

  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true);
    try {
      createAnswerMutation.mutate({
        content: values.content,
        questionId: questionId,
      });

      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent('');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [isSubmittingAI, setIsSubmittingAI] = useState<boolean>(false);
  const answerRef = useRef<ElementRef<'div'>>(null);
  let result = '';
  let char_index = 0;
  function type() {
    const enableCursor = true; // 启用光标效果
    if (char_index < result.length) {
      if (!answerRef.current) {
        return;
      }
      let txt = answerRef.current.innerText;
      const cursor = enableCursor ? '|' : '';
      if (enableCursor && txt.endsWith('|')) {
        txt = txt.slice(0, -1);
      }
      answerRef.current.innerText = txt + result.charAt(char_index) + cursor;
      char_index++;
      setTimeout(type, 1000 / 5); // 打字机速度控制, 每秒5个字
    }
  }
  const generateAIAnswer = async () => {
    const url = qs.stringifyUrl({
      url: 'http:localhost:8888/api/front/openai/generate',
      query: {
        questionId,
      },
    });
    try {
      const accessToken = localStorage.getItem('accessToken');
      setIsSubmittingAI(true);
      await fetch(url, {
        method: 'get',
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `${accessToken}`,
        },
      })
        .then((response) => {
          return response.body;
        })
        .then((body) => {
          const reader = body?.getReader();
          const decoder = new TextDecoder('utf-8');
          const read = (): any => {
            return reader?.read().then(({ done, value }) => {
              if (done) {
                // 读取完成
                return;
              }
              const data = decoder.decode(value, { stream: true });
              console.log(data);
              result += data;
              if (editorRef.current) {
                const editor = editorRef.current as any;
                editor.setContent(result);
              }
              type();

              return read();
            });
          };
          return read();
        })
        .catch((error) => {
          console.error('发生错误:', error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingAI(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          {t('Write your answer here')}
        </h4>

        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          onClick={generateAIAnswer}
        >
          <img
            src="/assets/icons/stars.svg"
            alt="star"
            width={12}
            height={12}
            className="object-contain"
          />
          {isSubmittingAI ? t('Generating...') : t('Generate an AI Answer')}
        </Button>
      </div>

      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={import.meta.env.VITE_TINY_API_KEY}
                    onInit={(_evt: any, editor: any) => {
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
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
                      content_style:
                        'body { font-family:Inter; font-size:16px }',
                      skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: theme === 'dark' ? 'dark' : 'light',
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('Submitting...') : t('Submit')}
            </Button>
          </div>
        </form>
      </Form>

      {/* <ReactMarkdown>{result}</ReactMarkdown> */}
      <div ref={answerRef}></div>
    </div>
  );
}
