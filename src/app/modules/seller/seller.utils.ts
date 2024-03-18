import { Ads } from '../ads/ads.model';
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
export const findAdsId = async (): Promise<string | undefined> => {
  const lastAds = await Ads.findOne({ role: 'ads' }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAds?.id ? lastAds.id.substring(2) : undefined;
};

export const generateAdsId = async (): Promise<string> => {
  const currentId = (await findAdsId()) || (0).toString().padStart(5, '0');
  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `ads-${incrementedId}`;

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
