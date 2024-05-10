import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 w-screen h-screen'>
      <div className='flex items-center justify-center gap-2'>
        <span className='text-lg font-medium'>200</span>
        <Separator orientation="vertical" className='h-8' />
        <p className='text-sm'>Next Admin</p>
      </div>

      <Link href="/auth/login">
        <Button>
          <span>Login</span>
          <ArrowRight className='w-4 h-4 ml-1' />
        </Button>
      </Link>
    </div>
  )
}