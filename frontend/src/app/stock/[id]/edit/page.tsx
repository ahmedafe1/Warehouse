import StockForm from '@/components/stock/StockForm';

interface EditStockPageProps {
    params: {
        id: string;
    };
}

export default async function EditStockPage({ params }: EditStockPageProps) {
    return <StockForm stockId={parseInt(params.id)} />;
} 