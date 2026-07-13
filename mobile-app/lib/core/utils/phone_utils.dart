class PhoneUtils {
  static String clean(String raw) {
    var p = raw.replaceAll(RegExp(r'[\s\-\(\)]'), '');
    if (p.startsWith('+255')) p = p.substring(4);
    else if (p.startsWith('255')) p = p.substring(3);
    if (p.startsWith('0')) p = p.substring(1);
    return p;
  }
  static String display(String phone) =>
      '+255 ${phone.substring(0,3)} ${phone.substring(3,6)} ${phone.substring(6)}';
}
