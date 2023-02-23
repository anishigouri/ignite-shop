import { stripe } from "@/lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product"
import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import Stripe from "stripe"
import axios from 'axios';
import { useState } from "react"

interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({product}: ProductProps) {

  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState<boolean>(false)
  const { isFallback } = useRouter()

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true)
      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId
      })

      const {checkoutUrl} = response.data

      window.location.href = checkoutUrl

    } catch (err) {
      // Comunicar com alguma ferramenta de observabilidade (datadog, sentry)
      alert('Falha ao redirecionar ao checkout')
    } finally {
      setIsCreatingCheckoutSession(false)
    }
  }

  if (isFallback) {
    return <p>Loading...</p>
  }

  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>
      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>

        <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>Comprar Agora</button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  
  //Usar productos mais acessados nos paths, pois gera a pagina com os builds dos id's
  return {
    paths: [
      {params: {id: 'prod_NPSdoDh2uMANmL'}}
    ],
    fallback: true // Caso o produto acessador não esteja no paths, faz uma consulta na API
  }
}

export const getStaticProps: GetStaticProps<any, {id: string}> = async ({ params }) => {

  const productId = params ? params.id : '';

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price.unit_amount ? price.unit_amount / 100 : 0),
        description: product.description,
        defaultPriceId: price.id
      }
    },
    revalidate: 60 * 60 * 1, // 1 hora
  }
}