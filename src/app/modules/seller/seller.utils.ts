import { Seller } from './seller.model';
// Seller ID
export const findLastSellerId = async (): Promise<string | undefined> => {
  const lastSeller = await Seller.findOne(
    {
      role: 'Seller',
    },
    { id: 1, _id: 0 }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastSeller?.id ? lastSeller.id.substring(4) : undefined;
};

export const generateSellerId = async (): Promise<string> => {
  const currentId =
    (await findLastSellerId()) || (0).toString().padStart(5, '0'); //00000
  //increment by 1
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  //20 25

  return incrementedId;
};

// Faculty ID
const generateRandomString = (): string => {
  return Math.random().toString(36).substring(2, 7);
};

// Function to find the last ads ID
export const findAdsId = async (): Promise<string | undefined> => {
  try {
    // Generate a random ID
    const lastAds = generateRandomString();
    return lastAds;
  } catch (error) {
    console.error('Error finding ads ID:', error);
    return undefined;
  }
};

// Function to generate the next ads ID
export const generateAdsId = async (): Promise<string> => {
  try {
    // Get the last ads ID
    const currentId = (await findAdsId()) || '00000';
    let incrementedId = (parseInt(currentId, 36) + 1).toString(36).padStart(5, '0');
    incrementedId = `ads-${incrementedId}`;

    return incrementedId;
  } catch (error) {
    console.error('Error generating ads ID:', error);
    throw error;
  }
};
// Admin ID
// export const findLastAdminId = async (): Promise<string | undefined> => {
//   const lastFaculty = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
// };

// export const generateAdminId = async (): Promise<string> => {
//   const currentId =
//     (await findLastAdminId()) || (0).toString().padStart(5, '0');
//   let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
//   incrementedId = `A-${incrementedId}`;

//   return incrementedId;
// };
