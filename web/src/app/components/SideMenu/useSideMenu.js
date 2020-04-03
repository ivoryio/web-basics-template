import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from "react"

const SIDEMENU = {
  expanded: "216px",
  collapsed: "64px"
}

export const useSideMenu = ({ initialExpanded = true }) => {
  const [{ isExpanded, width }, setExpanded] = useState({
    width: initialExpanded ? SIDEMENU.expanded : SIDEMENU.collapsed,
    isExpanded: initialExpanded
  })

  useLayoutEffect(() => {
    const appBody = document.querySelector('[role="app-body"]')

    if (appBody) {
      if (isExpanded) appBody.style.marginLeft = SIDEMENU.expanded
      else appBody.style.marginLeft = SIDEMENU.collapsed
    }

    return () => {
      appBody.style.marginLeft = 0
    }
  }, [isExpanded])

  const expand = useCallback(() => {
    setExpanded({ isExpanded: true, width: SIDEMENU.expanded })
  }, [])

  const collapse = useCallback(() => {
    setExpanded({ isExpanded: false, width: SIDEMENU.collapsed })
  }, [])

  const toggle = useMemo(() => (isExpanded ? collapse : expand), [
    collapse,
    expand,
    isExpanded
  ])

  useEffect(() => {
    window.addEventListener("collapseSidemenu", collapse)
    window.addEventListener("expandSidemenu", expand)
    return () => {
      window.removeEventListener("collapseSidemenu", collapse)
      window.removeEventListener("expandSidemenu", expand)
    }
  }, [collapse, expand])

  return {
    isExpanded,
    toggle,
    width
  }
}
