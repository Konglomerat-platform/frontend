import { Image, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../auth/AuthContext";
import { ProductCard } from "../../components/cards/ProductCard";
import { PageTitle } from "../../components/ui/PageTitle";
import { useUi } from "../../context/UiContext";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { createProduct, listProducts } from "../../services/catalogService";

type ProductImageDraft = {
  file: File;
  previewUrl: string;
};

const MAX_PRODUCT_IMAGES = 8;
const MAX_PRODUCT_IMAGE_SIZE = 8 * 1024 * 1024;

export function CompanyContentPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useUi();
  const qc = useQueryClient();
  const [imageDrafts, setImageDrafts] = useState<ProductImageDraft[]>([]);
  const imageDraftsRef = useRef<ProductImageDraft[]>([]);
  const { data: products = [] } = useQuery({
    queryKey: ["my-products", user?.name],
    queryFn: () => listProducts(user?.name),
    enabled: !!user,
  });
  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-products"] }),
  });

  useEffect(() => {
    imageDraftsRef.current = imageDrafts;
  }, [imageDrafts]);

  useEffect(() => {
    return () => imageDraftsRef.current.forEach(revokeDraft);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const images = await Promise.all(imageDrafts.map((draft) => fileToDataUrl(draft.file)));
    await create.mutateAsync({
      name: { ru: data.get("name") },
      desc: { ru: data.get("desc") },
      price: data.get("price"),
      ico: "new",
      images,
    });
    form.reset();
    clearDrafts();
  }

  function addDrafts(files: File[]) {
    const valid = files.filter((file) => {
      if (!file.type.startsWith("image/")) return false;
      if (file.size <= MAX_PRODUCT_IMAGE_SIZE) return true;
      toast(t("fileTooLarge"), `${file.name} · ${t("max8Mb")}`, "error");
      return false;
    });
    if (!valid.length) return;
    setImageDrafts((current) => {
      const slots = MAX_PRODUCT_IMAGES - current.length;
      if (slots <= 0) {
        toast(t("fileTooLarge"), t("max8Images"), "error");
        return current;
      }
      if (valid.length > slots) toast(t("fileTooLarge"), t("max8Images"), "error");
      return [
        ...current,
        ...valid.slice(0, slots).map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
      ];
    });
  }

  function clearDrafts() {
    imageDraftsRef.current.forEach(revokeDraft);
    setImageDrafts([]);
  }

  function removeDraft(index: number) {
    setImageDrafts((current) => {
      const next = [...current];
      const [removed] = next.splice(index, 1);
      if (removed) revokeDraft(removed);
      return next;
    });
  }

  return (
    <WorkspaceLayout role="company" active="content">
      <PageTitle title={t("contentManagement")} />
      <form className="panel panel-body product-form" onSubmit={submit}>
        <div className="form-group">
          <label>{t("productName")}</label>
          <input className="form-control" name="name" required />
        </div>
        <div className="form-group">
          <label>{t("price")}</label>
          <input className="form-control" name="price" required />
        </div>
        <div className="form-group">
          <label>{t("description")}</label>
          <textarea className="form-control" name="desc" rows={3} />
        </div>
        <div className="form-group">
          <label>{t("productImages")}</label>
          <label className="image-drop">
            <Image />
            <span>{t("attachImages")}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={(event) => {
                addDrafts(Array.from(event.target.files || []));
                event.currentTarget.value = "";
              }}
            />
          </label>
          {imageDrafts.length ? (
            <div className="product-drafts">
              {imageDrafts.map((draft, index) => (
                <div className="product-draft" key={`${draft.file.name}-${draft.file.size}-${index}`}>
                  <img src={draft.previewUrl} alt="" />
                  <button type="button" onClick={() => removeDraft(index)} aria-label={t("cancel")}>
                    <X />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <button className="btn btn-primary" disabled={create.isPending}>
          {t("addProduct")}
        </button>
      </form>
      <div className="grid cols-4 market-grid mt-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </WorkspaceLayout>
  );
}

function revokeDraft(draft: ProductImageDraft) {
  URL.revokeObjectURL(draft.previewUrl);
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
