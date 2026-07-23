import { type ReactNode } from "react";

import SelectionCard from "../../../../components/ui/SelectionCard/SelectionCard";

export interface SelectionItem {
    id: string;
    name: string;
    description?: string;
    icon?: ReactNode;
    badge?: string;
    disabled?: boolean;
}

interface SelectionGridProps<T extends SelectionItem> {
    items: T[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const SelectionGrid = <T extends SelectionItem>({
    items,
    selectedId,
    onSelect,
}: SelectionGridProps<T>) => {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
                <SelectionCard
                    key={item.id}
                    title={item.name}
                    description={item.description}
                    icon={item.icon}
                    badge={item.badge}
                    disabled={item.disabled}
                    selected={selectedId === item.id}
                    onClick={() => {
                        if (!item.disabled) {
                            onSelect(item.id);
                        }
                    }}
                />
            ))}
        </div>
    );
};

export default SelectionGrid;