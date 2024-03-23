import { v4 as uuidv4 } from 'uuid';
import { Seller } from '../seller/seller.model';
// Seller ID
export const findLastSellerId = async (): Promise<string | undefined> => {
  const lastSeller = await Seller.findOne(
    {
      role: 'seller',
    },
    { id: 1, _id: 0 }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastSeller?.id ? lastSeller.id.substring(4) : undefined;
};

export const generateSellerId = (fullName: string): string => {
  // Generate a new UUID (v4)
  const newId = uuidv4();

  // Extract only the last 5 characters to match the desired format
  const formattedId = newId.substr(newId.length - 5) + fullName.trim();

  return formattedId;
};

// Faculty ID
export const findLastFacultyId = async (): Promise<string | undefined> => {
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async (): Promise<string> => {
  const currentId =
    (await findLastFacultyId()) || (0).toString().padStart(5, '0');
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `F-${incrementedId}`;

  return incrementedId;
};

// Admin ID
export const findLastAdminId = async (): Promise<string | undefined> => {
  const lastFaculty = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateAdminId = async (): Promise<string> => {
  const currentId =
    (await findLastAdminId()) || (0).toString().padStart(5, '0');
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `A-${incrementedId}`;

  return incrementedId;
};
