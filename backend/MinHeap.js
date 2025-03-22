class MinHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    push(node) {
        this.heap.push(node);
        this.heapifyUp();
    }

    heapifyUp() {
        let index = this.heap.length - 1;
        while (
            index > 0 &&
            this.heap[index].score < this.heap[this.getParentIndex(index)].score
        ) {
            this.swap(index, this.getParentIndex(index));
            index = this.getParentIndex(index);
        }
    }

    pop() {
        if (this.heap.length === 1) return this.heap.pop();
        const root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return root;
    }

    heapifyDown() {
        let index = 0;
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            let rightChildIndex = this.getRightChildIndex(index);
            if (
                rightChildIndex < this.heap.length &&
                this.heap[rightChildIndex].score < this.heap[smallerChildIndex].score
            ) {
                smallerChildIndex = rightChildIndex;
            }

            if (this.heap[index].score <= this.heap[smallerChildIndex].score) {
                break;
            }

            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

module.exports = MinHeap;