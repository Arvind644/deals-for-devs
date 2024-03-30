import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Category } from '@/types/Types'

export default function CategorySelect({
  onCategoryChange,
  value = 'Select a Category',
}: {
  onCategoryChange: (category: Category) => void
  value?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-2xl font-extralight">Category *</span>
      <Select onValueChange={onCategoryChange} required>
        <SelectTrigger className="h-16 w-[334px] bg-transparent text-xl">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          {Object.values(Category)
            .sort()
            .map((dealType) => (
              <SelectItem key={dealType} value={dealType} className="text-xl">
                {dealType}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
}