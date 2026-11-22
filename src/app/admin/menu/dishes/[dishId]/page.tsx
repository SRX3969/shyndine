import DishFormPage from "../new/page";

export default function EditDishPage({
  params,
}: {
  params: Promise<{ dishId: string }>;
}) {
  return <DishFormPage params={params} />;
}
