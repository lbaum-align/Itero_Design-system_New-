export interface BreadcrumbItem {
  /** Display label for this breadcrumb link */
  label: string;
  /** URL the breadcrumb link points to */
  href?: string;
}

export interface BreadcrumbsProps {
  /** Ordered list of breadcrumb items — last item is treated as current page */
  items: BreadcrumbItem[];
  /** Additional CSS class names */
  className?: string;
}
