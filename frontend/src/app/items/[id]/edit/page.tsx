import ItemForm from '@/components/item/ItemForm';

interface EditItemPageProps {
    params: {
        id: string;
    };
}

export default async function EditItemPage({ params }: EditItemPageProps) {
    return <ItemForm itemId={parseInt(params.id)} />;
} 