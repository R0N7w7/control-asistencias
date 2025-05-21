import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4 py-12 gap-2">
            <Image
                src="/not-found.svg"
                alt="Página no encontrada"
                width={400}
                height={300}
                priority
            />
            <h1 className="mt-8 text-3xl font-bold text-gray-800">Página no encontrada</h1>
            <p className="mt-4 text-gray-600">
                Lo sentimos, la página que buscas no existe o fue movida.
            </p>
            <Button className="bg-[#b91116] mt-2">
                <Link href={'/login'} className="text-xl">
                    Volver al inicio
                </Link>
            </Button>
        </div>
    );
}
