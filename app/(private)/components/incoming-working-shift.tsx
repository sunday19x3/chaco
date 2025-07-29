'use client'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
export default function IncomingWorkingShift() {
  return (
    <div className='space-y-3 mt-4'>
      <div className='text-sm font-semibold px-4'>Ca làm sắp tới</div>
      <div>
        <Carousel
          opts={{
            align: 'start',
          }}>
          <CarouselContent className='px-4'>
            <CarouselItem className='basis-48'>
              <div className='rounded-xl text-xs border boder-[#F1F1F1] bg-white p-3 flex flex-col items-center gap-2'>
                <div className='flex flex-col items-center gap-1'>
                  <div className='text-[#7B7B7B]'>Ca chiều</div>
                  <div className='text-sm'>13:00 - 17:00, 29/03</div>
                </div>
                <div className='text-[#B1B1B1]'>Nhà máy Điện phân khu 1</div>
              </div>
            </CarouselItem>
            <CarouselItem className='basis-48'>
              <div className='rounded-xl text-xs border boder-[#F1F1F1] bg-white p-3 flex flex-col items-center gap-2'>
                <div className='flex flex-col items-center gap-1'>
                  <div className='text-[#7B7B7B]'>Ca chiều</div>
                  <div className='text-sm'>13:00 - 17:00, 29/03</div>
                </div>
                <div className='text-[#B1B1B1]'>Nhà máy Điện phân khu 1</div>
              </div>
            </CarouselItem>
            <CarouselItem className='basis-48'>
              <div className='rounded-xl text-xs border boder-[#F1F1F1] bg-white p-3 flex flex-col items-center gap-2'>
                <div className='flex flex-col items-center gap-1'>
                  <div className='text-[#7B7B7B]'>Ca chiều</div>
                  <div className='text-sm'>13:00 - 17:00, 29/03</div>
                </div>
                <div className='text-[#B1B1B1]'>Nhà máy Điện phân khu 1</div>
              </div>
            </CarouselItem>
            <CarouselItem className='basis-48'>
              <div className='rounded-xl text-xs border boder-[#F1F1F1] bg-white p-3 flex flex-col items-center gap-2'>
                <div className='flex flex-col items-center gap-1'>
                  <div className='text-[#7B7B7B]'>Ca chiều</div>
                  <div className='text-sm'>13:00 - 17:00, 29/03</div>
                </div>
                <div className='text-[#B1B1B1]'>Nhà máy Điện phân khu 1</div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
