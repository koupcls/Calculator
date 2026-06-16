import type { TreeNode } from "../trees/types";

interface QueueEntry {
    node: TreeNode;
    weight: number;
    idx?: number;
}

export class TreePriorityQueue {
    // Массив хранит элементы или null на месте удаленных
    private items: (QueueEntry | null)[] = [];
    private activeCount = 0; // Счетчик живых элементов

    public add(entry: QueueEntry): void {
        const newIdx = this.items.length;
        this.items.push({
            node: entry.node, 
            weight: entry.weight, 
            idx: newIdx
        });
        this.activeCount++;
    }

    public set(entry: QueueEntry, idx: number): void {
        // Проверяем, существует ли индекс в пределах массива
        if (idx >= 0 && idx < this.items.length) {
            // Если мы заменяем null на реальный элемент, увеличиваем счетчик
            if (this.items[idx] === null) {
                this.activeCount++;
            }
            this.items[idx] = { ...entry, idx }; // Гарантируем актуальный индекс
        }
    }

    public poll(): QueueEntry | undefined {
        const minIdx = this.minIndex;
        if (minIdx === -1) return undefined;

        const val = this.items[minIdx];
        this.items[minIdx] = null; // Освобождаем место
        this.activeCount--;
        
        return val ?? undefined;
    }

    private get minIndex(): number {
        let minIdx = -1;

        for (let i = 0; i < this.items.length; i++) {
            const current = this.items[i];

            // Игнорируем удаленные элементы
            if (current === null) {
                continue;
            }

            // Если это первый найденный живой элемент 
            // ИЛИ его вес меньше текущего найденного минимума
            if (minIdx === -1 || current.weight < this.items[minIdx]!.weight) {
                minIdx = i;
            }
        }

        return minIdx;
    }

    // Теперь возвращает количество актуальных элементов в очереди
    public get size(): number {
        return this.activeCount;
    }

    // Дополнительный метод для получения только живых элементов
    public get list(): QueueEntry[] {
        return this.items.filter((item): item is QueueEntry => item !== null);
    }
}
