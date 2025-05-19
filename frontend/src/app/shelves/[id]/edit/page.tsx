import ShelfForm from '@/components/shelf/ShelfForm';

interface EditShelfPageProps {
    params: {
        id: string;
    };
}

export default function EditShelfPage({ params }: EditShelfPageProps) {
    return <ShelfForm shelfId={parseInt(params.id)} />;
} 