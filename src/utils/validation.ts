import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

export const tonerSchema = z.object({
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  pesoCheio: z.number().min(0, 'Peso deve ser positivo'),
  pesoVazio: z.number().min(0, 'Peso deve ser positivo'),
  impressorasCompativeis: z.array(z.string()).min(1, 'Adicione pelo menos uma impressora'),
  cor: z.enum(['black', 'cyan', 'magenta', 'yellow']),
  capacidadeFolhas: z.number().min(1, 'Capacidade deve ser maior que zero'),
  precoCompra: z.number().min(0, 'Preço deve ser positivo')
});

export type UserInput = z.infer<typeof userSchema>;
export type TonerInput = z.infer<typeof tonerSchema>;