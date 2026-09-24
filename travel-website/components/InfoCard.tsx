type InfoCardProps = {
    title: string;
    value: string | number;
}

export default function InfoCard({title, value}: InfoCardProps) {
    return(
        <div>
            <span className="text-xs text-gray-400 block mb-1">{title}</span>
            <span className="text-sm font-medium text-gray-800">{value}</span>
        </div>
    )
}
