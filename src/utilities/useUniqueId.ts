import _uniqueId from 'lodash-es/uniqueId';
import { useMemo } from 'react';

export const useUniqueId = (prefix?: string) => {
    return useMemo(() => _uniqueId(prefix), [prefix]);
};
