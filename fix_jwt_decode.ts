import { JwtPayload } from 'jsonwebtoken';

// Расширяем тип JwtPayload для включения нужных полей
interface CustomJwtPayload extends JwtPayload {
    id: number;
    username: string;
    email: string;
    role: string;
}

export default CustomJwtPayload; 