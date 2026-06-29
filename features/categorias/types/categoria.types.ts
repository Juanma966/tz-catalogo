export interface Categoria {
    id: string;
    empresa_id: string;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
    created_at: string;
    updated_at: string;
}

export interface CrearCategoriaInput {
    nombre: string;
    descripcion?: string;
    activo?: boolean;
}

export type ActualizarCategoriaInput = Partial<CrearCategoriaInput>;