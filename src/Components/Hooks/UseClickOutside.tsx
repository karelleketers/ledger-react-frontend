import React, { useEffect } from 'react'

export const useClickOutside = (
	ref: React.MutableRefObject<HTMLDivElement>,
	handler: (e: MouseEvent) => void
) => {
	useEffect(() => {
		const listener = (e: MouseEvent) => {
			if (!ref.current || ref.current.contains(e.target as Node)) {
				return
			}
			handler(e)
		}
		document.addEventListener('mousedown', listener)

		return () => {
			document.removeEventListener('mousedown', listener)
		}
	}, [handler, ref])
}