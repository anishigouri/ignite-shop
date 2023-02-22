import logoImg from '@/assets/logo.svg'
import Image from 'next/image'
import { Container } from './style'

export function Header() {
  return (
    <Container>
      <Image src={logoImg.src} alt="" width={100} height={100}/>
    </Container>
  )
}