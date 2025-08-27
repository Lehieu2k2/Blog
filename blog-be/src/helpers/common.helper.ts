import { BadRequestException } from '@nestjs/common';

export const isPhone = (phone: string) => {
  if (!/^0\d{9,10}$/.test(phone)) {
    return false;
  }
  return true;
};

export const isMail = (email: string) => {
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    return false;
  }
  return true;
};

export const parseDate = (dateInput: string | Date): Date | null => {
  if (!dateInput) return null;

  if (dateInput instanceof Date) {
    return dateInput;
  }

  if (typeof dateInput === 'string') {
    // Check if it's DD/MM/YYYY format first
    if (dateInput.includes('/')) {
      const parts = dateInput.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        // Validate date values
        if (day < 1 || day > 31 || month < 1 || month > 12) {
          throw new BadRequestException(
            'Invalid date values. Please check day, month, and year.',
          );
        }

        // Create date with proper formatting (ensure 2-digit month/day)
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const date = new Date(formattedDate);

        if (!isNaN(date.getTime())) {
          return date;
        }

        throw new BadRequestException(
          'Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY',
        );
      }
    }

    // Try parsing other formats (ISO, etc.)
    const isoDate = new Date(dateInput);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }

    throw new BadRequestException(
      'Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY',
    );
  }

  return null;
};


export const addRecursiveChildren = (data, allData, level = 1) => {
  if (level > 3) return;

  for (const parent of data) {
    const children = allData.filter((child) => child.parentId === parent.id); // Sửa lại tên biến
    parent.children = children;

    if (children.length > 0) {
      addRecursiveChildren(children, allData, level + 1);
    }
  }
  return data;
};
