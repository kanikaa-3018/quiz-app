import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function QuestionForm({ onSuccess, initialData, questionId }) {
  const { toast } = useToast();

  const form = useForm({
    defaultValues: initialData || {
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      class: "",
      stream: "",
      subject: "",
      topic: "",
    },
  });

  const [selectedClass, setSelectedClass] = useState(form.getValues("class"));
  const [selectedStream, setSelectedStream] = useState(form.getValues("stream"));

  useEffect(() => {
    const subscription = form.watch((value) => {
      setSelectedClass(value.class);
      setSelectedStream(value.stream);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const classOptions = ["5", "6", "7", "8", "9", "10", "11", "12"];

  const subjectOptions = () => {
    if (["11", "12"].includes(selectedClass)) {
      if (selectedStream === "PCM") return ["Physics", "Chemistry", "Mathematics"];
      if (selectedStream === "PCB") return ["Physics", "Chemistry", "Biology"];
      return [];
    }
    return ["English", "Mathematics", "Science", "Social Science", "EVS"];
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const method = questionId ? "PUT" : "POST";
      const url = questionId ? `/api/questions/${questionId}` : "/api/questions";
      return apiRequest(method, url, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: questionId
          ? "Question updated successfully"
          : "Question created successfully",
      });
      onSuccess();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save question. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    const optionMap = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
    };
  
    const transformedData = {
      class: Number(data.class),
      stream: ["11", "12"].includes(data.class) ? data.stream : "None",
      subject: data.subject,
      topic: data.topic,
      questionText: data.questionText,
      options: [data.optionA, data.optionB, data.optionC, data.optionD],
      correctAnswerIndex: optionMap[data.correctAnswer],
    };
  
    createMutation.mutate(transformedData);
  };
  

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Class */}
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("stream", "");
                    form.setValue("subject", "");
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white shadow-md">
                    {classOptions.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        Class {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stream */}
          {["11", "12"].includes(selectedClass) && (
            <FormField
              control={form.control}
              name="stream"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stream</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("subject", "");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select Stream" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white shadow-md">
                      <SelectItem value="PCM">PCM</SelectItem>
                      <SelectItem value="PCB">PCB</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Subject */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white shadow-md">
                    {subjectOptions().map((subj) => (
                      <SelectItem key={subj} value={subj}>
                        {subj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Topic */}
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input placeholder="Enter topic (e.g., Thermodynamics)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Question */}
        <FormField
          control={form.control}
          name="questionText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Enter your question here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((opt) => (
            <FormField
              key={opt}
              control={form.control}
              name={`option${opt}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option {opt}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Option ${opt}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Correct Answer */}
        <FormField
          control={form.control}
          name="correctAnswer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correct Answer</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white shadow-md">
                  {["A", "B", "C", "D"].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      Option {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="btn-primary"
          >
            {createMutation.isPending
              ? "Saving..."
              : questionId
              ? "Update Question"
              : "Add Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
