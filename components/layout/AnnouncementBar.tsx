export default function AnnouncementBar() {
  return (
    <div
      className="w-full py-2.5 px-4 text-center text-white text-sm font-medium"
      style={{ backgroundColor: 'var(--navy)' }}
    >
      📞 Comunícate con nuestros asesores:{' '}
      <a
        href="tel:6045903572"
        className="font-bold hover:underline"
        style={{ color: 'var(--cyan)' }}
      >
        604 590 3572 ext. 1
      </a>
    </div>
  )
}
