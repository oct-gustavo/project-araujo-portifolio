import type { Metadata } from 'next'
import { TelaConfigurar } from './TelaConfigurar'

export const metadata: Metadata = { title: 'configurar 2FA · araújo_' }

export default function PaginaConfigurar2FA() {
  return <TelaConfigurar />
}
