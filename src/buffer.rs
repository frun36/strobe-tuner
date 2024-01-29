use std::collections::VecDeque;

pub struct Buffer<T> {
    buffer: VecDeque<T>,
    capacity: usize,
}

impl<T> Buffer<T> {
    pub fn new(capacity: usize) -> Self {
        Self {
            buffer: VecDeque::with_capacity(capacity),
            capacity,
        }
    }

    pub fn insert(&mut self, value: T) {
        if self.buffer.len() >= self.capacity {
            self.buffer.pop_front();
        }

        self.buffer.push_back(value);
    }

    pub fn get_contents_ordered(&mut self) -> &[T] {
        self.buffer.make_contiguous()
    }

    pub fn get_contents(&self) -> &[T] {
        let ptr = self.buffer.as_slices().1.as_ptr();
        unsafe { std::slice::from_raw_parts(ptr, self.buffer.len()) }
    }

    pub fn get_last(&self) -> Option<&T> {
        self.buffer.back()
    }
}

impl<T: Clone> Buffer<T> {
    pub fn insert_slice(&mut self, slice: &[T]) {
        if slice.len() >= self.capacity {
            self.buffer.clear();
            self.buffer
                .extend(slice[slice.len() - self.capacity..].iter().cloned());
            return;
        }

        if self.buffer.len() + slice.len() >= self.capacity {
            self.buffer
                .drain(0..(self.buffer.len() + slice.len() - self.capacity));
        }

        self.buffer.extend(slice.iter().cloned());
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn insert_test() {
        let mut buff = Buffer::new(3);
        buff.insert(1);
        buff.insert(2);
        buff.insert(3);
        buff.insert(4);
        buff.insert(5);
        buff.insert(6);
        buff.insert(7);

        assert_eq!(buff.get_contents_ordered(), [5, 6, 7]);
    }

    #[test]
    fn insert_slice_test() {
        let mut buff = Buffer::new(3);
        buff.insert(1);
        buff.insert(2);
        buff.insert_slice(&[3, 4]);

        assert_eq!(buff.get_contents_ordered(), [2, 3, 4]);

        buff.insert_slice(&[5, 6, 7, 8]);

        assert_eq!(buff.get_contents_ordered(), [6, 7, 8]);
    }

    #[test]
    fn get_contents_test() {
        let mut buff = Buffer::new(3);
        buff.insert(1);
        buff.insert(2);
        buff.insert(3);

        assert_eq!(buff.get_contents(), buff.get_contents());

        buff.insert(4);

        assert_eq!(buff.get_contents(), [4, 2, 3]);

        let mut buff = Buffer::new(5);

        buff.insert(1);
        buff.insert(2);
        buff.insert(3);
        buff.insert(4);
        buff.insert(5);
        buff.insert(6);
        buff.insert(7);
        buff.insert(8);
        buff.insert(9);
        buff.insert(10);
        buff.insert(11);

        assert_eq!(buff.get_contents(), [11, 7, 8, 9, 10]);
    }
}
