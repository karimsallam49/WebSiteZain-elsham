import { useState } from "react";
import { Plus, Minus, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AddonsListProps {
  product: any;
  onChange: (data: {
    add_on_ids: number[];
    add_on_qtys: number[];
    selected_addons: {
      id: number;
      name: string;
      qty: number;
      price: number;
      image?: string;
    }[];
  }) => void;
}

const AddonsList = ({ product, onChange }: AddonsListProps) => {
  const { t } = useTranslation();

  const [selectedAddons, setSelectedAddons] = useState<
    { id: number; name: string; qty: number; price: number; image?: string }[]
  >([]);

  // ✅ send both ids, qtys, and full selected addons
  const updateParent = (addons: any[]) => {
    const add_on_ids = addons.map((a) => a.id);
    const add_on_qtys = addons.map((a) => a.qty);
    onChange({ add_on_ids, add_on_qtys, selected_addons: addons });
  };

  const handleToggleAddon = (addon: any) => {
    const exists = selectedAddons.find((a) => a.id === addon.id);
    let updated;

    if (exists) {
      updated = selectedAddons.filter((a) => a.id !== addon.id);
    } else {
      updated = [
        ...selectedAddons,
        {
          id: addon.id,
          name: addon.name,
          qty: 1,
          price: addon.price,
          image: addon.imageFullPath,
        },
      ];
    }

    setSelectedAddons(updated);
    updateParent(updated);
  };

  const handleQtyChange = (id: number, type: "inc" | "dec") => {
    const updated = selectedAddons.map((a) =>
      a.id === id
        ? { ...a, qty: type === "inc" ? a.qty + 1 : Math.max(1, a.qty - 1) }
        : a
    );
    setSelectedAddons(updated);
    updateParent(updated);
  };

  const handleRemoveAddon = (id: number) => {
    const updated = selectedAddons.filter((a) => a.id !== id);
    setSelectedAddons(updated);
    updateParent(updated);
  };

  return (
    <div>
      {Array.isArray(product.add_ons) && product.add_ons.length > 0 && product.add_ons.map((addon: any, index: number) => {
        const isSelected = selectedAddons.some((a) => a.id === addon.id);
        const selected = selectedAddons.find((a) => a.id === addon.id);

        return (
          <label
            key={index}
            className="d-flex align-items-center justify-content-between w-100 variation-option rounded p-2 mb-2 border"
            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
          >
            <div className="d-flex align-items-center gap-3 w-100">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggleAddon(addon)}
              />

              {addon.image && (
                <img
                  src={addon.imageFullPath}
                  alt={addon.name}
                  className="variation-option-img"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              )}

              <span className="fw-semibold w-100" style={{ fontSize: "small" }}>
                {addon.name}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 w-50 justify-content-end">
              <span
                style={{ fontSize: "small", minWidth: "60px" }}
                className="text-muted fw-semibold text-end"
              >
                {addon.price.toFixed(2)} {t("currency")}
              </span>

              {isSelected && (
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="border-0 bg-transparent"
                    onClick={() => handleQtyChange(addon.id, "dec")}
                  >
                    <Minus size={15} color="gray" />
                  </button>

                  <span className="fw-bold fs-6">{selected?.qty}</span>

                  <button
                    className="border-0 bg-transparent"
                    onClick={() => handleQtyChange(addon.id, "inc")}
                  >
                    <Plus size={15} color="gray" />
                  </button>

                  <button
                    className="border-0 bg-transparent"
                    onClick={() => handleRemoveAddon(addon.id)}
                  >
                    <Trash size={15} color="red" fill="red" />
                  </button>
                </div>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default AddonsList;
