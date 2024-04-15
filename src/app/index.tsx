
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { RootState, store } from '@/store';
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { TodoSchema } from "./model";
import { useCreateTodoMutation, useListTodosQuery } from "./service";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";


const Home = () => {

  const page = useSelector((state: RootState) => state.app.page);
  const pageSize = useSelector((state: RootState) => state.app.pageSize);
  const sorting = useSelector((state: RootState) => state.app.sorting);
  const columnFilters = useSelector((state: RootState) => state.app.columnFilters);

  const dispatch = useDispatch();

  const [progress, setProgress] = useState(13)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])
  
  const navigate = useNavigate();

  const { data: todos, isLoading: todosLoading, refetch: refreshTodos } = useListTodosQuery({
    skip: page * pageSize,
    take: pageSize,
    pageSize: pageSize,
    sortBy: sorting?.replace('-', ''),
    sortDirection: sorting?.startsWith('-') ? 'desc' : 'asc',
    ...columnFilters
  });

  const [mutate] = useCreateTodoMutation();


  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof TodoSchema>>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      completed: false,
      description: '',
      title: ''
    },
  })

  async function onSubmit(values: z.infer<typeof TodoSchema>) {
    if (values.title) {
      try {
        const createdSubscriber = await mutate(values).unwrap();
        setOpen(false);
        refreshTodos();
      } catch (error) {
        console.error('Error creating todo:', error);
      }
    }
  }


  if (todosLoading) return <div className="flex justify-center items-center h-screen"><Progress value={progress} className="w-[60%]" /></div>;


  return (
    <>

      <div className='w-full h-screen flex justify-center items-center flex-col'>
        <div className=" w-full lg:w-7/12  px-5 lg:px-0 ">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mb-3 flex bg-green-600 hover:bg-green-800">Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Todo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className=" text-black">Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Your title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </div>
              <DialogFooter>
                <Button variant="outline" type="submit" className="border">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Table className='w-full lg:w-7/12 border-slate-200 rounded-md border-2 lg:m-auto mx-5'>
          <TableCaption>A list of your todos.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] text-center font-medium">ID</TableHead>
              <TableHead className="text-center w-[200px]">Title</TableHead>
              <TableHead className="text-center w-[200px]">Completed</TableHead>
              <TableHead className="text-center w-[300px]">Description</TableHead>
              <TableHead className="text-center w-[300px]">Full Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos?.items && todos?.items.map((todo) => (
              <TableRow key={todo.id} className="bg-slate-100 hover:bg-slate-200">
                <TableCell className="w-[100px]">{todo.id}</TableCell>
                <TableCell className="text-center w-[200px]">{todo.title}</TableCell>
                <TableCell className="text-center w-[200px]">{todo.completed ? 'yes' : 'no'}</TableCell>
                <TableCell className="text-center w-[300px]">{todo.description}</TableCell>
                <TableCell className="text-center w-[300px]"><Button onClick={() => navigate("description")} variant="outline">Show full description </Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      </div>
    </>
  );
};




export default function HomeDataSourceProvider() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  )
}