import React, { useEffect, useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import { getCourses, type Course } from "../../api/courses";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses({ status: "published" })
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando cursos...</p>;

  return (
    <div className="flex justify-center mt-10">
      <Accordion.Root
        type="single"
        collapsible
        className="w-[500px] rounded-md bg-white shadow-lg"
      >
        {courses.map((course) => (
          <Accordion.Item
            key={course._id}
            value={course._id}
            className="border-b border-gray-200"
          >
            <Accordion.Header>
              <Accordion.Trigger
                className={classNames(
                  "group flex h-[50px] flex-1 items-center justify-between px-5 text-left font-medium text-gray-800 hover:bg-gray-50",
                  "transition-colors"
                )}
              >
                {course.title}
                <ChevronDownIcon
                  className="ml-2 h-5 w-5 text-gray-500 transition-transform duration-300 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden text-gray-600 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
              <div className="px-5 py-3">
                <p className="mb-2">{course.description}</p>
                <span className="inline-block rounded bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-600">
                  {course.category}
                </span>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}