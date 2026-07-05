import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../auth/AuthContext";
import { ProductCard } from "../../components/cards/ProductCard";
import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { createProduct, listProducts } from "../../services/catalogService";

export function CompanyContentPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: products = [] } = useQuery({ queryKey: ["my-products", user?.name], queryFn: () => listProducts(user?.name), enabled: !!user });
  const create = useMutation({ mutationFn: createProduct, onSuccess: () => qc.invalidateQueries({ queryKey: ["my-products"] }) });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    create.mutate({ name: { ru: data.get("name") }, desc: { ru: data.get("desc") }, price: data.get("price"), ico: "🆕" });
    event.currentTarget.reset();
  }

  return (
    <WorkspaceLayout role="company" active="content">
      <PageTitle title={t("contentManagement")} />
      <form className="panel panel-body" onSubmit={submit}>
        <div className="form-group"><label>{t("productName")}</label><input className="form-control" name="name" required /></div>
        <div className="form-group"><label>{t("price")}</label><input className="form-control" name="price" required /></div>
        <div className="form-group"><label>{t("description")}</label><textarea className="form-control" name="desc" rows={3} /></div>
        <button className="btn btn-primary">{t("addProduct")}</button>
      </form>
      <div className="grid cols-4 market-grid mt-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    </WorkspaceLayout>
  );
}
